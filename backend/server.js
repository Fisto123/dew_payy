import express from "express";
import authRoutes from "./routes/auth/auth.js";

import departmentRoutes from "./routes/department/department.js";
import billerRoutes from "./routes/biller/biller.js";
import paymentRoutes from "./routes/payment/payment.js";

import invoiceRoutes from "./routes/invoice/invoice.js";
import cors from "cors";
import bodyParser from "body-parser";
import { errorHandler } from "./error/error.js";
import { EventEmitter } from "events";

EventEmitter.defaultMaxListeners = 15;
const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  })
);
app.use("/public/images", express.static("./public/images"));

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
app.use("/mobile/v1", authRoutes);

app.use("/mobile/v1", departmentRoutes);

app.use("/mobile/v1", billerRoutes);

app.use("/mobile/v1", invoiceRoutes);

app.use("/mobile/v1", paymentRoutes);

//error
app.use(errorHandler);

app.listen(8000, () => console.log(`server is running on port 5000`));

export default app;
