import { VercelV0Chat } from "@/components/ui/v0-ai-chat"
import { BackgroundBeams } from "@/components/ui/background-beams"

export function V0ChatDemo() {
    return (
        <div className="relative min-h-screen w-full flex items-center justify-center bg-background overflow-hidden">
            <BackgroundBeams className="opacity-40" />
            <div className="relative z-10 w-full">
                <VercelV0Chat />
            </div>
        </div>
    )
}
