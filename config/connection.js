// Connect to the Mongo DB
export default mongoose.connect("mongodb://localhost/news-scraper-db", {
  useNewUrlParser: true
});