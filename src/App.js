import { QueryClient, QueryClientProvider } from "react-query";
import "./App.css";
import { Calendar } from "./compoenents";

function App() {
  const queryClien = new QueryClient();

  return (
    <div className="App">
      <QueryClientProvider client={queryClien}>
        <div className="calendar">
          <Calendar mode="range" />
          {/* mode is either range or single */}
        </div>
      </QueryClientProvider>
    </div>
  );
}

export default App;
