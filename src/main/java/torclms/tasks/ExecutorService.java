package torclms.tasks;

import java.util.concurrent.Executor;
import java.util.concurrent.Executors;

public class ExecutorService {

    private Executor executor;

    private static ExecutorService instance = new ExecutorService();

    private ExecutorService() {
        executor = Executors.newSingleThreadExecutor();
    }

    public static ExecutorService getInstance () {
        return instance;
    }

    public void addJob (Runnable job) {
        executor.execute(job);
    }
}
