Project For VTCA 

* Using: ReactJS

Installation:
* npm i in vtca-app/backend

* npm i in vtca-app

If warning onSetupMiddleware :
* Go to vtca-app/node_modules/react-scripts/config/webpackDevServer.config.js

* Replace 
    ```
    onBeforeSetupMiddleware(devServer) {
      devServer.app.use(evalSourceMapMiddleware(devServer));

      if (fs.existsSync(paths.proxySetup)) {
        require(paths.proxySetup)(devServer.app);
      }
    },
    onAfterSetupMiddleware(devServer) {
      devServer.app.use(redirectServedPath(paths.publicUrlOrPath));
      devServer.app.use(noopServiceWorkerMiddleware(paths.publicUrlOrPath));
    },
    ```

* To
    ```
    setupMiddlewares: (middlewares, devServer) => {
      if(!devServer){
        throw new Error("webpack-dev-server is not defined")
      }
  
      if (fs.existsSync(paths.proxySetup)) {
        require(path.proxySetup) (devServer.app)
      }
  
      middlewares.push(
        evalSourceMapMiddleware(devServer),
        redirectServedPath(paths.publicUrlOrPath),
        noopServiceWorkerMiddleware(paths.publicUrlOrPath)
      )
      return middlewares
    }
    ```
