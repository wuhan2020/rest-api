# wuhan2020 rest-api - Type package

## Usage

### 1. Sign in GitHub packages with NPM

1. Generate a [PAT][1] with `read:packages` authorization
2. Run Sign-in command in your terminal, and use PAT as password:
    ```shell
    npm login --scope=@wuhan2020 --registry=https://npm.pkg.github.com
    ```

### 2. Installation

```shell
npm i pnpm -g

pnpm i @wuhan2020/rest-api -D
```

[1]: https://github.com/settings/tokens
