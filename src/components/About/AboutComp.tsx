"use client";
import React, { useEffect, useRef } from "react";
import styles from "@/styles/general/about.module.css";
import { FaPhoneAlt } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import logotransperent from "@/assets/logotransperent.png";
const AboutComp = () => {
  const sections = useRef<HTMLElement[]>([]); 

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const target = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            target.style.opacity = "1";
            target.style.transform = "translateY(0)";
            target.style.transition = "opacity 1s ease, transform 2s ease"; 
          } else {
            target.style.opacity = "0";
            target.style.transform = "translateY(80px)"; 
          }
        });
      },
      { threshold: 0.5 }
    );

    sections.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => {
      sections.current.forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  return (
    <div className={styles.aboutPage}>
      <div className={styles.container}>
        <h2 className={styles.mainTitle}>אודותינו</h2>
        <div className={styles.aboutContent}>
          <div
            className={styles.aboutUs}
            ref={(el) => {
              if (el) sections.current.push(el);
            }}
          >
            <div className={styles.context}>
              <p>
                <div className={styles.title}>מי אנחנו </div>
                כאן תוכל לגלות, לנהל ולהנות מכל ההטבות שמגיעות לך מכל מועדוני
                הלקוחות שלך במקום אחד נוח ונגיש.
                <br></br>
                ב-PerkPoint אנחנו מקבצים את כל ההטבות, ההנחות, והמבצעים הבלעדיים
                שמגיעים לך, כך שתוכל להפיק את המרב מכל מועדון לקוחות אליו
                הצטרפת.
              </p>
            </div>
            <div className={styles.animation}>
              <DotLottieReact
                src="https://lottie.host/ebf49ecb-6a76-4cfc-8d1d-a5bbd3d199c6/eqjFiyYtz1.lottie"
                loop
                autoplay
              />
            </div>
          </div>

          <div
            className={styles.ourVision}
            ref={(el) => {
              if (el) sections.current.push(el);
            }}
          >
            <div className={styles.animation}>
              <DotLottieReact
                src="https://lottie.host/c2b0438d-7cba-4b98-b6a9-61e591edcf7b/BzDLNrsWff.lottie"
                autoplay
                loop
              />
            </div>
            <p className={styles.context}>
              <div className={styles.title}>החזון שלנו</div>
              אנחנו ב-PerkPoint שואפים להנגיש לך את כל ההטבות והמבצעים המיוחדים
              בצורה קלה, מהירה ונוחה.
              <br />
              המטרה שלנו היא לרכז את כל ההטבות המגיעות לך מכל מועדוני הלקוחות
              שלך במקום אחד .<br></br> ב-PerkPoint תוכל למצוא את כל ההטבות במקום
              אחד, לנהל את ההטבות האהובות עלייך ולהתעדכן במבצעים חדשים במהירות
              ובקלות.
            </p>
          </div>

          <div
            className={styles.howItsWork}
            ref={(el) => {
              if (el) sections.current.push(el);
            }}
          >
            <p className={styles.context}>
              <div className={styles.title}>איך זה עובד?</div>
              לאחר הרשמתך לאתר תוכל לבחור את כרטיסי המועדון שברשותך בעמוד
              "מועדונים" ולהוסיף אותם ל"מועדונים שלי".
              <br></br> כעת כל מה שנותר לך לעשות הוא לעבור לעמוד "ההטבות שלי"
              ולהנות מכל ההטבות שמגיעות לך!
            </p>
            <div className={styles.animation3}>
              <DotLottieReact
                src="https://lottie.host/790511fa-ed61-47b7-8ab5-96d7f3d9d14d/yLmaz7VtkS.lottie"
                loop
                autoplay
              />
            </div>
          </div>

          <div
            className={styles.contactUs}
            ref={(el) => {
              if (el) sections.current.push(el);
            }}
          >
            <div className={styles.animation}>
              <DotLottieReact
                src="https://lottie.host/89156dbc-8953-4e63-910c-ad055a68c2c0/FLJUGWt4bJ.lottie"
                autoplay
                loop
              />
            </div>
            <div className={styles.context}>
              <div className={styles.title}>צור קשר</div>
              <p className={styles.subtitle}>אנחנו כאן כדי לענות על כל שאלה!</p>
              <div className={styles.contactItem}>
                <FaPhoneAlt className={styles.icon} />
                <span className={styles.contactText}>0599999999</span>
              </div>
              <div className={styles.contactItem}>
                <a
                  href="mailto:PerkPointSite@gmail.com"
                  className={styles.link}
                >
                  <IoIosMail className={styles.icon} />
                  <span className={styles.contactText}>
                    PerkPointSite@gmail.com
                  </span>
                </a>
              </div>
            </div>
          </div>

          <div
            className={styles.logoContainer}
            ref={(el) => {
              if (el) sections.current.push(el);
            }}
          >
            <img
              src={logotransperent.src}
              alt="Perk Point Logo"
              className={styles.image}
            />
            <p className={styles.logoTitle}>
              כל ההטבות והמבצעים השווים במקום אחד!
            </p>
          </div>
        </div>
        <div className={styles.line}>
          <div
            className={styles.testimonials}
            ref={(el) => {
              if (el) sections.current.push(el);
            }}
          >
            <div className={styles.title}></div>
          </div>
        </div>

        <div
          className={styles.testimonials}
          ref={(el) => {
            if (el) sections.current.push(el);
          }}
        >
          <div className={styles.title2}>מה אומרים עלינו?</div>
          <div className={styles.tellAbout}>
            <p>"החיים שלי נהיו הרבה יותר קלים מאז שאני משתמשת ב-PerkPoint!"</p>
            <p>- יעל, לקוחה מרוצה</p>
          </div>
          <div className={styles.tellAbout}>
            <p>
              "לא יודעת איך הסתדרתי בעבר בלי perk-point! אתר פשוט ונח, ממליצה
              לכולם!"
            </p>
            <p>- רחל, לקוחה מרוצה</p>
          </div>
          <div className={styles.tellAbout}>
            <p>"מצאתי את כל ההטבות שאני אוהב במקום אחד. פשוט מדהים!"</p>
            <p>- משה, לקוח מרוצה</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutComp;
