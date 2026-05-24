const cron = require("node-cron");
const User = require("../models/User");
const transporter = require("../config/mail");
const dailyForecastTemplate = require("../templates/dailyForecastTemplate");

cron.schedule("0 8 * * *", async () => {
  console.log("Running daily forecast emails...");

  const users = await User.find();

  for (const user of users) {
    const location = user.locations.find((loc) => loc.isPrimary);

    if (!location) continue;

    const html = dailyForecastTemplate({
      name: user.name,
      city: location.city,
      temp: 31,
      condition: "Light Rain",
      humidity: 78,
      wind: 12,
      recommendation: "Carry an umbrella today.",
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Today's Weather Forecast",
      html,
    });
  }
});