import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const ArticleTabs = ({ activeTab, setActiveTab }) => (
  <div className="tabs">
    {['All Items', 'News', 'Announcements', 'Tutorials'].map(tab => (
      <button key={tab} className={`tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
        {tab}
      </button>
    ))}
  </div>
);

const ArticleCard = ({ article }) => (
  <div className="article-card">
    <img src={article.image} alt="Article Thumbnail" className="article-image" />
    <div className="article-content">
      <div className="tag-wrapper">
        <span className={`tag ${article.type.replace(/\s/g, '')}`}>{article.type}</span>
      </div>
      <h3 className="article-title">{article.title}</h3>
      <p className="article-summary">{article.summary}</p>
      <div className="article-footer">
        <div className="author-info">
          <img src="https://via.placeholder.com/50" alt="Author" className="author-image" />
          <div>
            <span className="author-name">{article.author}</span>
            <span className="author-date">{article.date}</span>
          </div>
        </div>
        <a href={article.url} className="read-more-link">Read More</a>
      </div>
    </div>
  </div>
);

const LatestArticles = () => {
  const [activeTab, setActiveTab] = useState('All Items');
  const articles = useSelector(state => state.articles.articles);  // Use articles from Redux
  const filteredArticles = articles.filter(article => activeTab === 'All Items' || article.type === activeTab);

  return (
    <section className="blog-section">
      <div className="container">
        <h1 className="heading1x">Latest Articles</h1>
        <p>Discover the most outstanding AI Articles</p>
        <ArticleTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="articles-grid">
          {filteredArticles.map(article => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestArticles;
