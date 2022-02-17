import { createContext } from "react";
import { Member } from "../pages/chat";

export const MemberContext = createContext<Partial<{ members: Member[] }>>({});