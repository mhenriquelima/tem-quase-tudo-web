const YOUTUBE_VIDEO_ID = 'IUOEs0NlDGQ'; //id temporário

export default function ComoFiz() {
    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold text-brand-dark mb-6">Como eu fiz</h1>

            <div className="aspect-video w-full rounded-lg overflow-hidden shadow">
                <iframe
                    className="w-full h-full"
                    src={`https://www.youtube-nocookie.com/embed/${YOUTUBE_VIDEO_ID}`}
                    title="Como eu fiz o Tem Quase Tudo"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            </div>
        </div>
    );
}
