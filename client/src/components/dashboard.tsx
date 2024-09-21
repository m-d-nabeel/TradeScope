import { AlpacaService } from "@/services/api/alpaca.service";
import { AlpacaAccount } from "@/types/alpaca.types";
import { useEffect, useState } from "react";
import { AlpacaAccountDisplay } from "./account";

export const Dashboard = () => {
  const [account, setAccount] = useState<AlpacaAccount | null>(null);
  useEffect(() => {
    const fetchAccount = async () => {
      const accountData = await AlpacaService.getAccount();
      setAccount(accountData);
    };
    fetchAccount();
  }, []);

  if (!account) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <AlpacaAccountDisplay account={account} />
    </div>
  );
};
