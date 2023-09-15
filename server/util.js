async function executeMongoOperation(operation) {
    try {
      const result = await operation.exec();
      console.log("result is", result);
      return result;
    } catch (error) {
      console.error('MongoDB Error:', error);
  

      return {
        error: true,
        message: error.message,
      };
    }
  }

export default executeMongoOperation