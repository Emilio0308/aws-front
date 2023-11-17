import ChatsPages from "../components/ChatsPages";
import VideoCall from "../components/VideoCall";

const TrackMedia = () => {
  return (
    <main className="p-3 bg-gray-200 grid gap-10">
      <VideoCall />
      <ChatsPages />
    </main>
  )
}
export default TrackMedia