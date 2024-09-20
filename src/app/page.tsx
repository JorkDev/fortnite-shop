"use client";

import { useEffect, useState } from 'react';
import Flickity from 'flickity';
import { getFortniteShop } from '../utils/api';
import styles from './page.module.css';

interface ShopItem {
  name: string;
  image: string;
  price: {
    finalPrice: number;
  };
  displayAssets: Array<{
    full_background: string;
  }>;
  displayName: string;
  displayType: string;
  rarity: string;
}

export default function Home() {
  const [shopData, setShopData] = useState<ShopItem[] | null>(null);
  const [featuredTimer, setFeaturedTimer] = useState<string>("00:00:00");
  const [dailyTimer, setDailyTimer] = useState<string>("00:00:00");

  useEffect(() => {
    // Fetch shop data
    async function fetchShopData() {
      const data = await getFortniteShop();
      setShopData(data?.shop ?? null);
    }
    fetchShopData();

    // Initialize countdown timer
    const start = new Date();
    start.setHours(2, 0, 0);

    function pad(num: number): string {
      return ("0" + Math.floor(num)).slice(-2);
    }

    function tick() {
      const now = new Date();
      if (now > start) {
        start.setDate(start.getDate() + 1);
      }
      const remain = (start.getTime() - now.getTime()) / 1000;
      const hh = pad((remain / 3600) % 24);
      const mm = pad((remain / 60) % 60);
      const ss = pad(remain % 60);

      const timer = `${hh}:${mm}:${ss}`;
      setFeaturedTimer(timer);
      setDailyTimer(timer);

      setTimeout(tick, 1000);
    }

    tick();
  }, []);

  // Carousel initialization using Flickity
  useEffect(() => {
    const carousels = document.querySelectorAll('.carousel');
    carousels.forEach((carousel) => {
      new Flickity(carousel, {
        prevNextButtons: false,
        pageDots: false,
        contain: true,
        wrapAround: true,
        autoPlay: 5000,
        imagesLoaded: true,
        setGallerySize: false,
      });
    });
  }, [shopData]);

  if (!shopData) {
    return <div>Loading Fortnite shop...</div>;
  }

  const featuredItems = shopData.slice(0, 5);
  const dailyItems = shopData.slice(5, 10);

  return (
    <div className={styles.main}>
      <div className={`${styles.count} ${styles.feat}`}>
        <div><h3>Featured Items</h3></div>
        <div><span id="f-timer">{featuredTimer}</span></div>
      </div>
      <div className={`${styles.count} ${styles.day}`}>
        <div><h3>Daily Items</h3></div>
        <div><span id="d-timer">{dailyTimer}</span></div>
      </div>

      {/* Featured Items */}
      <div className={styles.feature}>
        {featuredItems.map((item, index) => (
          <div key={index} className={`${styles.card} ${styles['rarity-' + item.rarity]}`}>
            <div className={styles['img-ph']}>
              <img src={item.displayAssets[0]?.full_background} alt={item.displayName} />
              <div className={styles['card-info']}>
                <h4 className={styles['card-name']}><span>{item.displayName}</span></h4>
                <p className={styles['card-type']}><span>{item.displayType}</span></p>
              </div>
            </div>
            <p className={styles['card-price']}>
              <img src="https://image.fnbr.co/price/icon_vbucks.png" alt="V-Bucks" />
              <span>{item.price.finalPrice}</span>
            </p>
          </div>
        ))}
      </div>

      {/* Daily Items */}
      <div className={styles.daily}>
        {dailyItems.map((item, index) => (
          <div key={index} className={`${styles.card} ${styles['rarity-' + item.rarity]}`}>
            <div className={styles['img-ph']}>
              <img src={item.displayAssets[0]?.full_background} alt={item.displayName} />
              <div className={styles['card-info']}>
                <h4 className={styles['card-name']}><span>{item.displayName}</span></h4>
                <p className={styles['card-type']}><span>{item.displayType}</span></p>
              </div>
            </div>
            <p className={styles['card-price']}>
              <img src="https://image.fnbr.co/price/icon_vbucks.png" alt="V-Bucks" />
              <span>{item.price.finalPrice}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
