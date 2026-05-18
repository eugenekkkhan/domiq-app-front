import { useEffect, useState } from "react";
import { listUsers } from "../queries";

export type UserInfo = { id: number; nickname: string; role: string };

export function useUsers(): Map<number, UserInfo> {
  const [users, setUsers] = useState<Map<number, UserInfo>>(new Map());
  useEffect(() => {
    listUsers()
      .then((res) => {
        const map = new Map<number, UserInfo>();
        for (const u of res.data) map.set(u.id, u);
        setUsers(map);
      })
      .catch(() => {});
  }, []);
  return users;
}
