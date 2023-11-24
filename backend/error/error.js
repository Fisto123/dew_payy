export const errorHandler = (err, req, res, next) => {
  console.error("Error caught in global error handler:", err);

  if (err.name === "SequelizeValidationError") {
    // Handle validation errors
    const validationErrors = err.errors.map((error) => ({
      field: error.path,
      message: error.message,
    }));
    res.status(400).json({ errors: validationErrors });
  } else if (err.name === "SequelizeUniqueConstraintError") {
    const validationErrors = err.errors.map((error) => ({
      field: error.path,
      message: `${error?.path} already exists`,
    }));
    res.status(409).json({ errors: validationErrors });
  } else {
    // Handle other types of errors
    res.status(500).json({ error: "Internal Server Error" });
  }
};
