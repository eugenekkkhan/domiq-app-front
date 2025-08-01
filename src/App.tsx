import { initData, mainButton } from "@telegram-apps/sdk-react";
import { useEffect } from "react";

initData.restore();

const user = initData.user();

const App = () => {
  useEffect(() => {
    if (mainButton.mount.isAvailable()) {
      mainButton.mount();
      mainButton.setParams({
        backgroundColor: "#4800ff",
        hasShineEffect: true,
        isEnabled: true,
        isVisible: true,
        text: "My text",
        textColor: "#ffffff",
      });
      function listener() {
        console.log("Clicked!");
      }

      mainButton.onClick(listener);
      mainButton.offClick(listener);
    }
  }, []);
  return (
    <div>
      Penis☺️Id: {user?.id} {user?.is_premium ? "⭐️" : "non-premium"}
      <span style={{fontSize: "24px"}}>Видеоинструкция по подключению и работе с камерой</span>
    </div>
  );
};

export default App;
