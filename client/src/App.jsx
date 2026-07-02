import { RouterProvider } from "react-router-dom";
import { router } from "./routes/router";
import useOrderSocket from '@/hooks/useOrderSocket'

function App() {
	useOrderSocket()
	return <RouterProvider router={router} />;
}

export default App;
