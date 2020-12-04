const express = require("express");
const Joi = require("joi");
const app = express(); // Create Express Application on the app variable
app.use(express.json()); //used the json files

const hostname = '127.0.0.1';
const port = 8000;

// Get data to the server
const customers = [
  { id: 1, title: "George" },
  { id: 2, title: "Josh" },
  { id: 3, title: "Tyler" },
  { id: 4, title: "Alice" },
  { id: 5, title: "Candice" },
];

// READ/GET Request Handlers
// Display the message when the url consist of '/'
app.get("/", (req, res) => {
  res.send("Welcome to my school API!");
});

// Display the list of customers when the url consist of '/api/customers'
app.get("/api/customers", (req, res) => {
  res.send(customers);
});

// Display the information of specific customer when you mention the id
app.get("/api/customers/:id", (req, res) => {
  const customer = customers.find((c) => c.id === parseInt(req.params.id));
  // If there is no valid customer id display a 404 error
  if (!customer) {
    res.status(404).send("Customer not found...");
  } else {
    res.send(customer);
  }
});

// CREATE/POST request handler
// Create new customer information
app.post("/api/customers", (req, res) => {
  const { error, value } = validateCustomer(req.body.title);
  if (error) {
    res.status(404).send(error.details[0].message);
    return;
  }
  // Increment the customer ID
  const customer = {
    id: customers.length + 1,
    title: value.title,
  };
  customers.push(customer);
  res.send(
    `Customer ..${value.title} added and allocated ID ..${customer.id} successfully!`
  );
  res.send(customer);
});

// UPDATE/PUT request handler
// Update existing customer information
app.put("/api/customers/:id", (req, res) => {
  const customer = customers.find((c) => c.id === parseInt(req.params.id));
  if (!customer) {
    res.status(404).send("Customer not found...");
  }
  const { error, value } = validateCustomer(req.body.title);
  if (error) {
    res.status(404).send(error.details[0].message);
    return;
  }
  customer.title = value.title;
  res.send(`Updated customer with id ..${customer.id} to ${customer.title}`);
});

// DELETE request handler
// Delete customer details
app.delete("/api/customers/:id", (req, res) => {
  const customer = customers.find((c) => c.id === parseInt(req.params.id));
  if (!customer) {
    res.status(404).send("Customer not found...");
  }
  const index = customers.indexOf(customer);
  customers.splice(index, 1);
  res.send(`Deleted customer ..${customer.title} identified by id ..${customer.id} successfully!`);
});

// Validate information
function validateCustomer(customer) {
  const schema = Joi.object({
    title: Joi.string().min(3).required(),
  });
  return schema.validate({ title: customer });
}

app.listen(port, hostname, () => console.log(`Server running at http://${hostname}:${port}/`));
