import Image from "next/image";
import styles from "@/app/page.module.css";
import Login from "@/components/Login.js";

export default function AdminLogin() {
  return (
    <main className={styles.main}>
      <div className={styles.hero}>
        <Image
          src="/hero.jpg"
          alt="hero background"
          priority
          layout="fill"
          objectFit="cover"
        />
        <div className={styles.adminOverlay}>
          <Login />
        </div>
      </div>
    </main>
  );
}
