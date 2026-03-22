import axios from "axios";

import { useEffect, useState } from "react";

function Dashboard() {
  const [dashdata, setdashdata] = useState(null);
  useEffect(() => {
    const getdata = async () => {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`, // 🔑 attach token
        },
      });
      setdashdata(response.data);
    };
    getdata();
  }, []);

  return (
    <>
      <div>
        {dashdata && (
          <div>
            <ul>
              <li>{dashdata.message}</li>
              <li>{dashdata.email}</li>
              <li>{dashdata.secret_data}</li>
            </ul>
          </div>
        )}
      </div>
    </>
  );
}

export default Dashboard;
