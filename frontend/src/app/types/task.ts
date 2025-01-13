interface Contributor {
    id: string;
    name: string;
    imageUrl?: string;
}

interface Task {
    id: string;
    name: string;
    description: string;
    reward: number;
    contributors: Contributor[];
    status: "OPEN" | "CLOSED";
}

interface TaskCardProps {
    task: Task;
    onAccept: (taskId: string) => void;
}

export type { Contributor, Task, TaskCardProps };
