-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_period_type_fkey" FOREIGN KEY ("period_type") REFERENCES "Period"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
