require("dotenv").config();

const express = require("express");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 3000;

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;

const PAYPAL_BASE =
  process.env.PAYPAL_BASE ||
  "https://api-m.sandbox.paypal.com";

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

async function getAccessToken() {
  const auth = Buffer.from(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`
  ).toString("base64");

  const response = await fetch(
    `${PAYPAL_BASE}/v1/oauth2/token`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type":
          "application/x-www-form-urlencoded"
      },
      body: "grant_type=client_credentials"
    }
  );

  const data = await response.json();

  if (!response.ok) {
    console.log(data);
    throw new Error("PayPal login failed.");
  }

  return data.access_token;
}

app.get("/api/config", (req, res) => {
  res.json({
    clientId: PAYPAL_CLIENT_ID
  });
});

app.post("/api/create-order", async (req, res) => {
  try {
    let amount = Number(req.body.amount);

    if (!amount || amount < 1 || amount > 500) {
      return res.status(400).json({
        error: "Invalid amount"
      });
    }

    amount = amount.toFixed(2);

    const token = await getAccessToken();

    const response = await fetch(
      `${PAYPAL_BASE}/v2/checkout/orders`,
      {
        method: "POST",

        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          intent: "CAPTURE",

          purchase_units: [
            {
              description: "Support HEERO",

              amount: {
                currency_code: "USD",
                value: amount
              }
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.log(data);

      return res.status(500).json({
        error: "Could not create payment."
      });
    }

    res.json({
      id: data.id
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "Server error"
    });
  }
});

app.post(
  "/api/capture-order/:id",
  async (req, res) => {

    try {

      const token = await getAccessToken();

      const response = await fetch(
        `${PAYPAL_BASE}/v2/checkout/orders/${req.params.id}/capture`,
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.log(data);

        return res.status(500).json({
          error: "Payment failed"
        });
      }

      res.json(data);

    } catch (error) {

      console.log(error);

      res.status(500).json({
        error: "Server error"
      });

    }
  }
);

app.listen(PORT, () => {
  console.log(
    `🔥 HEERO site running: http://localhost:${PORT}`
  );
});
