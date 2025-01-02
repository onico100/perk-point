"use client";
import React, { useState } from "react";
import styles from "@/styles/Clubs/AddClub.module.css";
import { useRouter } from "next/navigation";
import SenddingAnimate from "@/components/Loading/SenddingAnimate";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CldUploadWidget, CloudinaryUploadWidgetResults } from "next-cloudinary";
import { clubSchema } from "@/types/ClubTypes";

const AddClub: React.FC = () => {
    const [isApi, setIsApi] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: zodResolver(clubSchema),
        mode: "onBlur",
    });

    const handleLogoUpload = async (result: CloudinaryUploadWidgetResults) => {
        if (result && result.info && typeof result.info === "object" && "secure_url" in result.info) {
            const secureUrl = result.info.secure_url as string;
            setValue("clubLogo", secureUrl);
        } else {
            console.error("Error during upload:", result);
            setError("שגיאה בהעלאת הלוגו.");
        }
    };

    const onSubmit = async (data: any) => {
        setError("");
        setIsLoading(true);

        if (!isApi) {
            data.route = ""; 
        }

        const simplifiedFormData = isApi
            ? {
                clubName: data.clubName,
                clubLink: data.clubLink,
                clubLogo: data.clubLogo,
                route: data.route,
                comments: data.comments,
                email: data.email,
            }
            : {
                clubName: data.clubName,
                clubLink: data.clubLink,
                clubLogo: data.clubLogo,
                comments: data.comments,
                email: data.email,
            };

        try {
            const response = await fetch("/api/addClub", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(simplifiedFormData),
            });

            setIsLoading(false);

            if (response.ok) {
                setSent(true);
                router.push("/");
            } else {
                const data = await response.json();
                setError(data.message || "Error sending message.");
            }
        } catch (err) {
            setIsLoading(false);
            setError("Error sending message.");
        }
    };

    const handleToggle = () => {
        setIsApi((prev) => !prev);
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>בקשה להוספת מועדון</h1>
            <div className={styles.toggleContainer}>
                <label className={styles.toggleLabel}>
                    <input
                        type="checkbox"
                        checked={isApi}
                        onChange={handleToggle}
                        className={styles.hiddenCheckbox}
                    />
                    <span className={styles.toggleSwitch}></span>
                    {isApi ? "עם API" : " בלי API"}
                </label>
            </div>
            {isApi ? (
                <div>
                    <a href="/assets/Documentation.pdf" download>
                        <button className={styles.downloadButton}>הורד את הדקומנטציה</button>
                    </a>
                    <div className={styles.instructionText}>
                        <p> לרישום המועדון שלך</p>
                        <p>פנה עלינו כדי לרשום את המועדון שלך ולקבל clubId יחודי</p>
                        <p>ה-clubId יופיע הכול בבקשה שנשלך לניתוב שלך.</p>
                    </div>
                </div>
            ) : (
                <div className={styles.noApi}>
                    <p>יראו את ההטבות שלך רק אחרי שספק יבחר בך</p>
                </div>
            )}
            <div>
                <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                    <label className={styles.label}>שם המועדון:</label>
                    <input
                        className={styles.input}
                        {...register("clubName")}
                    />
                    {errors.clubName && <p className={styles.error}>{String(errors.clubName.message)}</p>}
                    <label className={styles.label}>לינק למועדון:</label>
                    <input
                        className={styles.input}
                        {...register("clubLink")}
                    />
                    {errors.clubLink?.message && <p className={styles.error}>{String(errors.clubLink.message)}</p>}

                    <label className={styles.label}>לוגו המועדון:</label>
                    <CldUploadWidget
                        uploadPreset="PerkPoint"
                        onSuccess={handleLogoUpload}
                    >
                        {({ open }) => {
                            return (
                                <button
                                    className={styles.uploadButton}
                                    onClick={() => open()}
                                >
                                    העלה לוגו
                                </button>
                            );
                        }}
                    </CldUploadWidget>
                    {isApi && (
                        <>
                            <label className={styles.label}>ניתוב:</label>
                            <input
                                className={styles.input}
                                {...register("route")}
                                placeholder="ניתוב ציבורי"
                            />
                        </>
                    )}
                    <label className={styles.label}>הערות:</label>
                    <textarea
                        className={styles.textarea}
                        {...register("comments")}
                    />
                    <label className={styles.label}>אימייל:</label>
                    <input
                        className={styles.input}
                        type="email"
                        {...register("email")}
                    />
                    {errors.email && <p className={styles.error}>{String(errors.email.message)}</p>}
                    <button type="submit" className={styles.submitButton}>שלח</button>
                </form>
            </div>
            {isLoading && <SenddingAnimate />}
            {error && <p className={styles.error}>{error}</p>}
            {sent && <p className={styles.success}>הבקשה נשלחה בהצלחה!</p>}
        </div>
    );
};

export default AddClub;