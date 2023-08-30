const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

const PROJECT_ID = "10028"; // RCL
const JIRA_BASE_URL = "https://icapitalnetwork.atlassian.net/rest/api/3"; // Jira Cloud
const JIRA_USERNAME = "your_email@icapitalnetwork.com"; // Jira Username
const JIRA_API_TOKEN =
  "TOKEN_FROM_JIRA ->  https://id.atlassian.com/manage-profile/security/api-tokens"; // Jira API Token

// Default
const JIRA_ASSIGNEE = "6315d36a6a8bb4eda677ecff"; // Default Assignee (Pedro Santos). You can search for ajs-remote-user in Jira Board and get the ID ( debug console )

app.post("/github-webhook", async (req, res) => {
  try {
    const { issue } = req.body;

    const jiraPayload = {
      fields: {
        assignee: {
          id: JIRA_ASSIGNEE,
        },
        description: {
          content: [
            {
              content: [
                {
                  text: issue.body,
                  type: "text",
                },
              ],
              type: "paragraph",
            },
          ],
          type: "doc",
          version: 1,
        },
        issuetype: {
          id: "10023",
        },
        labels: ["bugfix", "issue-from-github"],
        priority: {
          id: "3",
        },
        project: {
          id: PROJECT_ID,
        },
        summary: issue.title,
      },
      update: {},
    };

    const jiraResponse = await axios.put(
      `${JIRA_BASE_URL}/issue/RCL-780`,
      jiraPayload,
      {
        auth: {
          username: JIRA_USERNAME,
          password: JIRA_API_TOKEN,
        },
      }
    );

    console.log("Issue created on Jira:", jiraResponse.data.key);
    res.status(200).json({
      message: "Issue created on Jira successfully",
      response: jiraResponse.data,
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ message: "An error occurred" });
  }
});

app.get("/", (req, res) => {
  console.log(req.body);
  res.send("Hello World!");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
