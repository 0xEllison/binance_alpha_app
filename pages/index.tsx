import React from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';

// 动态导入组件以避免SSR问题
const BinanceAlphaCalculator = dynamic(
  () => import('../components/BinanceAlphaCalculator'),
  { ssr: false }
);

const Home = () => {
  return (
    <div>
      <Head>
        <title>币安Alpha积分计算工具</title>
        <meta name="description" content="计算币安Alpha空投的积分和参与机会" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <main>
        <BinanceAlphaCalculator />
      </main>
    </div>
  );
};

export default Home;