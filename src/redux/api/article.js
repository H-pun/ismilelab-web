// ** Axios Imports
import axios from "axios"

// ** Redux Imports
import { createSlice, createAsyncThunk, isAnyOf } from "@reduxjs/toolkit"

const endpoint = "/article"

export const getArticleList = createAsyncThunk("article/getArticleList", async () => {
  return await axios.get(`${endpoint}/list`).then((res) => {
    return res.data.data
  })
})

export const getArticle = createAsyncThunk("article/getArticle", async (id) => {
  return await axios.get(`${endpoint}/${id}`).then((res) => {
    return res.data.data
  })
})

export const createArticle = createAsyncThunk("article/createArticle", async (data) => {
  return await axios.postForm(endpoint, data)
})

export const deleteArticle = createAsyncThunk("article/deleteArticle", async (id) => {
  return await axios.delete(endpoint, { params: id })
})

export const getArticleCategories = createAsyncThunk("article/getArticleCategories", async () => {
  return await axios.get(`${endpoint}-category/list`).then((res) => {
    return res.data.data
  })
})


export const articleSlice = createSlice({
  name: "article",
  initialState: {
    isLoading: false,
    articles: [],
    article: {},
    categories: []
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getArticleList.fulfilled, (state, action) => {
        state.articles = action.payload.map((item) => ({
          ...item,
          authorImage: "https://via.placeholder.com/50",
          readTime: "10 min read",
          date: item.createdAt,
          image: item.thumbnailUrl ? `${import.meta.env.VITE_API_BASE_URL}/upload/${item.thumbnailUrl}` : "https://via.placeholder.com/500",
          summary:
            "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Et repellat sit vitae eligendi voluptatum exercitationem autem quia.",
          url: "#"
        }))
      })
      .addCase(getArticle.fulfilled, (state, action) => {
        state.article = {
          ...action.payload,
          authorImage: "https://via.placeholder.com/50",
          readTime: "10 min read",
          date: action.payload.createdAt,
          image: "../../article-images/article-1.JPG",
          summary:
            "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Et repellat sit vitae eligendi voluptatum exercitationem autem quia.",
          url: "#"
        }
      })
      .addCase(deleteArticle.fulfilled, (state, action) => {
        state.articles = state.articles.filter(article => article.id !== action.meta.arg)
      })
      .addCase(getArticleCategories.fulfilled, (state, action) => {
        state.categories = action.payload.map((item) => (
          { value: item.id, label: item.name }
        ))
      })
      .addMatcher(
        isAnyOf(getArticleList.pending, getArticle.pending, createArticle.pending, getArticleCategories.pending, deleteArticle.pending),
        (state) => {
          state.isLoading = true
        }
      )
      .addMatcher(
        isAnyOf(
          getArticleList.fulfilled,
          getArticleList.rejected,
          getArticle.fulfilled,
          getArticle.rejected,
          deleteArticle.fulfilled,
          deleteArticle.rejected,
          getArticleCategories.fulfilled,
          getArticleCategories.rejected,
          createArticle.fulfilled,
          createArticle.rejected
        ),
        (state) => {
          state.isLoading = false
        }
      )
  }
})

export const { } = articleSlice.actions

export default articleSlice.reducer
