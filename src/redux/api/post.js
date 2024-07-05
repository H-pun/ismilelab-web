// ** Axios Imports
import axios from "axios";

// ** Redux Imports
import { createSlice, createAsyncThunk, isAnyOf } from "@reduxjs/toolkit";

const endpoint = "/post";

export const getArticleList = createAsyncThunk(
  "post/getArticleList",
  async () => {
    return await axios.get(`${endpoint}/list`).then((res) => {
      return res.data.data;
    });
  }
);

export const getArticle = createAsyncThunk("post/getArticle", async (id) => {
  return await axios.get(`${endpoint}/${id}`).then((res) => {
    return res.data.data;
  });
});

export const postSlice = createSlice({
  name: "post",
  initialState: {
    isLoading: false,
    articles: [],
    article: {},
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
          image: "../../article-images/article-1.JPG",
          summary:
            "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Et repellat sit vitae eligendi voluptatum exercitationem autem quia.",
          url: "#",
        }));
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
          url: "#",
        };
      })

      .addMatcher(
        isAnyOf(getArticleList.pending, getArticle.pending),
        (state) => {
          state.isLoading = true;
        }
      )
      .addMatcher(
        isAnyOf(
          getArticleList.fulfilled,
          getArticleList.rejected,
          getArticle.fulfilled,
          getArticle.rejected
        ),
        (state) => {
          state.isLoading = false;
        }
      );
  },
});

export const {} = postSlice.actions;

export default postSlice.reducer;
