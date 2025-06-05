# Vymo Web Platform

## Setup

Use node version 20.10.0.

To automate node version switching between terminal, add following script to your ~/.zshrc

```bash
# place this after nvm initialization!
autoload -U add-zsh-hook

load-nvmrc() {
  local nvmrc_path
  nvmrc_path="$(nvm_find_nvmrc)"

  if [ -n "$nvmrc_path" ]; then
    local nvmrc_node_version
    nvmrc_node_version=$(nvm version "$(cat "${nvmrc_path}")")

    if [ "$nvmrc_node_version" = "N/A" ]; then
      nvm install
    elif [ "$nvmrc_node_version" != "$(nvm version)" ]; then
      nvm use
    fi
  elif [ -n "$(PWD=$OLDPWD nvm_find_nvmrc)" ] && [ "$(nvm version)" != "$(nvm version default)" ]; then
    echo "Reverting to nvm default version"
    nvm use default
  fi
}

add-zsh-hook chpwd load-nvmrc
load-nvmrc
```

### OR

manually we can swicth to node version mentioned in nvmrc

```bash
nvm use
```

## How to start local server

```bash
# install dependencies
yarn install
```

```bash
# start the app
yarn start

# this will give the interactive ui for which app to start
```

You can also run by directly giving the app name

```bash
yarn start --target=recruitment,onboarding,all
```

## Build

```bash
yarn build
```

## More About Web Platform

Refer this link [Web Platform](https://teamvymo.atlassian.net/wiki/spaces/ENGG/pages/3216146466/Web+Platform)

## IDE Setup

Refer this link [VS Code](https://teamvymo.atlassian.net/wiki/spaces/ENGG/pages/2919530600/Code+Format+Guidelines)
