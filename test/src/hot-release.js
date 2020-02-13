import hotRelease from "webpack-hot-release/client";

hotRelease({
  throttle: 20,
  gitHtml({ message, commit, date }) {
    return `${commit} ${message} ${date}`;
  }
});
