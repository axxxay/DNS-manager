const cors = require('cors');
const app = require('./config/express');
const userRoutes = require('./routes/userRoute');
const route53Routes = require('./routes/route53Route');
// const swaggerUi = require('swagger-ui-express');
// const YAML = require('yamljs');
// const swaggerDocument = YAML.load('./swagger_doc.yaml');


app.use(cors());

app.use('/api', userRoutes);
app.use('/dns', route53Routes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});