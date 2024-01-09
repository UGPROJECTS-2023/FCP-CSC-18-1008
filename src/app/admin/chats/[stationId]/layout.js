import ChatLayoutComp from "@/components/chat/ChatLayoutComp";

export default async function ChatLayout({ children, params }) {
  return <ChatLayoutComp params={params}>{children}</ChatLayoutComp>;
}
