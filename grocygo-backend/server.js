const app = require('./src/app');
const aiSuggestRouter = require('./src/ai/aiSuggest');

const PORT = process.env.PORT || 8080;

app.use('/api', aiSuggestRouter);

app.listen(PORT, () => {
  console.log(`GrocyGo backend listening on port ${PORT}`);
});
