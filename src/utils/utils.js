

  export function formatCurrency (value, inputCurrency)  {
    if (value) {
      return value.toLocaleString("en-US", {
        style: "currency",
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
        currency: inputCurrency ? inputCurrency : "USD",
      });
    }
  };