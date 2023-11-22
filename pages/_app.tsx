import {
  ThemedLayoutV2,
  ThemedSiderV2,
  useNotificationProvider,
} from "@refinedev/antd";
import { GitHubBanner, Refine } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import routerProvider, {
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from "@refinedev/nextjs-router";
import type { NextPage } from "next";
import { AppProps } from "next/app";

import { Header } from "@components/header";
import { ColorModeContextProvider } from "@contexts";
import "@refinedev/antd/dist/reset.css";
import dataProvider from "@refinedev/simple-rest";
import { App as AntdApp } from "antd";
import { appWithTranslation, useTranslation } from "next-i18next";
import { authProvider } from "src/authProvider";

const API_URL = "https://api.fake-rest.refine.dev";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  noLayout?: boolean;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout): JSX.Element {
  const renderComponent = () => {
    if (Component.noLayout) {
      return <Component {...pageProps} />;
    }

    return (
      <ThemedLayoutV2
        Header={() => <Header sticky />}
        Sider={(props) => <ThemedSiderV2 {...props} fixed />}
      >
        <Component {...pageProps} />
      </ThemedLayoutV2>
    );
  };

  const { t, i18n } = useTranslation();

  const i18nProvider = {
    translate: (key: string, params: object) => t(key, params),
    changeLocale: (lang: string) => i18n.changeLanguage(lang),
    getLocale: () => i18n.language,
  };

  return (
    <>
      <RefineKbarProvider>
        <ColorModeContextProvider>
          <AntdApp>
            <DevtoolsProvider>
              <Refine
                routerProvider={routerProvider}
                dataProvider={dataProvider(API_URL)}
                notificationProvider={useNotificationProvider}
                authProvider={authProvider}
                i18nProvider={i18nProvider}
                resources={[
                  {
                    name:"用户管理",
                    list:"/users",
                    create:"/users/create",
                    edit:"/users/edit/:id",
                    show:"/users/show/:id",
                    meta:{
                      canDelete:true
                    }
                  },
                  {
                    name:"角色管理",
                    list:"/roles",
                    create:"/roles/create",
                    edit:"/roles/edit/:id",
                    meta:{
                      canDelete:true
                    }
                  },
                  {
                    name:"群组管理",
                    list:'/groups',
                    create:"/groups/create",
                    edit:"/groups/edit/:id",
                    show:"/groups/show/:id",
                    meta:{
                      canDelete:true
                    }
                  },
                  {
                    name:"数据管理",
                    list:'/data',
                    meta:{
                      icon:''
                    }
                  },
                  {
                    name:'图谱管理',
                    list:'/data/graphs',
                    create:"/data/groups/create",
                    show:"/data/groups/show/:id",
                    meta:{
                      parent:'数据管理'
                    }
                  },
                  {
                    name:"schema管理",
                    list:"/data/schemas",
                    create:"/data/schemas/create",
                    show:"/data/schemas/show/:id",
                    meta:{
                      parent:'数据管理'
                    }
                  }
                ]}
                options={{
                  syncWithLocation: true,
                  warnWhenUnsavedChanges: true,
                  useNewQueryKeys: true,
                  projectId: "qrMCP7-PkNXku-rT1XFF",
                }}
              >
                {renderComponent()}
                <RefineKbar />
                <UnsavedChangesNotifier />
                <DocumentTitleHandler />
              </Refine>
              <DevtoolsPanel />
            </DevtoolsProvider>
          </AntdApp>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </>
  );
}

export default appWithTranslation(MyApp);
