import type { NextPage } from "next"
import dynamic from "next/dynamic"
import Head from "next/head"

const App = dynamic(() => import("../components/App"), { ssr: false })

const Home: NextPage = () => {
  return (
    <div className="flex justify-center items-center w-screen h-screen">
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </Head>
      <App></App>
    </div>
  )
}

export default Home
