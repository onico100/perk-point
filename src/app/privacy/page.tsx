import React from "react";

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>מדיניות פרטיות</h1>
      <section>
        <h2>1. איסוף מידע</h2>
        <p>
          1.1. האתר אוסף מידע אישי שמוזן על ידי המשתמש באופן ישיר, כגון שם,
          כתובת דוא"ל וטלפון, וכן מידע טכני כמו כתובת IP, סוג דפדפן ומידע על
          השימוש באתר.
        </p>
        <p>
          1.2. המידע משמש לשיפור חוויית המשתמש, מענה לפניות ושיפור השירותים
          המוצעים באתר.
        </p>
      </section>
      <section>
        <h2>2. שימוש במידע</h2>
        <p>
          2.1. המידע שנאסף יישמר בסודיות ולא יימסר לצדדים שלישיים למעט במקרים
          המפורטים במדיניות זו (כגון דרישות חוק).
        </p>
        <p>
          2.2. ייתכן שימוש במידע לצרכים סטטיסטיים, אך בצורה שאינה מזהה באופן
          אישי.
        </p>
      </section>
      <section>
        <h2>3. עוגיות (Cookies)</h2>
        <p>
          3.1. האתר משתמש בעוגיות (Cookies) לשיפור חוויית המשתמש ולניתוח פעילות
          באתר.
        </p>
        <p>
          3.2. המשתמש יכול לבחור לחסום עוגיות באמצעות הגדרות הדפדפן, אך ייתכן
          שחלק מהפונקציות באתר לא יהיו זמינות.
        </p>
      </section>
      <section>
        <h2>4. שמירת מידע</h2>
        <p>
          4.1. המידע שנאסף נשמר במערכות מאובטחות בהתאם לסטנדרטים מקובלים להגנה
          על מידע.
        </p>
        <p>
          4.2. בעל האתר עושה מאמצים סבירים לשמור על פרטיות המידע, אך אינו יכול
          להבטיח מניעת גישה בלתי מורשית באופן מוחלט.
        </p>
      </section>
      <section>
        <h2>5. זכויות המשתמש</h2>
        <p>
          5.1. המשתמש זכאי לעיין במידע שנאסף עליו, לבקש את תיקונו או מחיקתו על
          פי חוק.
        </p>
        <p>
          5.2. לבירור או בקשה בנושא פרטיות, ניתן ליצור קשר בכתובת
          example@example.com.
        </p>
      </section>
    </div>
  );
};

export default PrivacyPolicyPage;
