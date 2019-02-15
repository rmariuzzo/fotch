workflow "On Push Run Tests" {
  on = "push"
  resolves = ["Run tests"]
}

action "Install dependencies" {
  uses = "actions/npm@master"
  runs = "npm"
  args = "i"
}

action "Run tests" {
  uses = "actions/npm@master"
  needs = ["Install dependencies"]
  runs = "npm"
  args = "test"
}
