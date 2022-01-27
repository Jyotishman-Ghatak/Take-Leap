const express = require("express");
require("./db/sqlDb");
const userRoutes = require("./routers/user");
const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(userRoutes);


app.listen(PORT, () => {
    console.log(`Server Running at port ${PORT}🚀`);
})
