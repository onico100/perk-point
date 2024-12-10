import useGeneralStore from "@/stores/generalStore";
import { doSocialLogin } from "./actions";
import { ClientMode } from "@/types/types";

const LoginGoogleForm = () => {
  const setCurrentUser = useGeneralStore.getState().setCurrentUser;
  const setClientMode = useGeneralStore.getState().setClientMode;
  const currentUser = useGeneralStore.getState().currentUser;

  console.log("LoginGoogleForm");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const action = formData.get("action");
    if (action) 
      {
      const addedUser= await doSocialLogin(formData);
      setCurrentUser(addedUser);
      //setClientMode(ClientMode.user);
    }
    else {
      console.error("Action is null");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* הוספת השדה בתור חלק מהטופס */}
      <input type="hidden" name="action" value="google" />
      <button
        type="submit"
        className="bg-pink-400 text-white p-1 rounded-md m-1 text-lg"
      >
        Sign In With Google
      </button>
    </form>
  );
};

export default LoginGoogleForm;
