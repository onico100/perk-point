import { FcGoogle } from "react-icons/fc"; // אייקון גוגל
import useGeneralStore from "@/stores/generalStore";
import { doSocialLogin } from "./actions";
import { ClientMode } from "@/types/types";
import styles from "./google.module.css";

const LoginGoogleForm = () => {
  const setCurrentUser = useGeneralStore.getState().setCurrentUser;
  const setClientMode = useGeneralStore.getState().setClientMode;
  const currentUser = useGeneralStore.getState().currentUser;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const action = formData.get("action");
    if (action) {
      const addedUser = await doSocialLogin(formData);
      setCurrentUser(addedUser);
      //setClientMode(ClientMode.user);
    } else {
      console.error("Action is null");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="hidden" name="action" value="google" />
      <button  type="submit" className={styles.googleButton}>  
        המשך באמצעות Google<FcGoogle className="text-2xl mr-2" />
      </button>
    </form>
  );
};

export default LoginGoogleForm;
