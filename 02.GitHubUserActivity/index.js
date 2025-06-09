#!/usr/bin/env node

const https = require('https');

// Function to fetch GitHub user activity
const fetchGitHubActivity = (username) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path: `/users/${username}/events`,
      headers: {
        'User-Agent': 'Node.js GitHub Activity CLI',
      },
    };

    https.get(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 404) {
          reject(new Error(`User "${username}" not found`));
          return;
        }
        if (res.statusCode !== 200) {
          reject(new Error(`GitHub API error: ${res.statusCode}`));
          return;
        }
        try {
          const activities = JSON.parse(data);
          resolve(activities);
        } catch (error) {
          reject(new Error('Failed to parse GitHub API response'));
        }
      });
    }).on('error', (error) => {
      reject(new Error(`Failed to fetch data: ${error.message}`));
    });
  });
};

// Function to format activity message
const formatActivity = (activity) => {
  const { type, repo, payload } = activity;
  const repoName = repo.name;

  switch (type) {
    case 'PushEvent':
      return `Pushed ${payload.commits?.length || 0} commits to ${repoName}`;
    case 'IssuesEvent':
      return `${payload.action} an issue in ${repoName}`;
    case 'CreateEvent':
      return `Created ${payload.ref_type} in ${repoName}`;
    case 'WatchEvent':
      return `Starred ${repoName}`;
    case 'ForkEvent':
      return `Forked ${repoName}`;
    case 'PullRequestEvent':
      return `${payload.action} a pull request in ${repoName}`;
    default:
      return `${type} in ${repoName}`;
  }
};

// Main function
const main = async () => {
  const username = process.argv[2];

  if (!username) {
    console.error('Please provide a GitHub username');
    console.log('Usage: node index.js <username>');
    process.exit(1);
  }

  try {
    console.log(`\nFetching activity for ${username}...\n`);
    const activities = await fetchGitHubActivity(username);
    
    if (activities.length === 0) {
      console.log('No recent activity found.');
      return;
    }

    activities.slice(0, 10).forEach((activity) => {
      console.log(`- ${formatActivity(activity)}`);
    });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

main();