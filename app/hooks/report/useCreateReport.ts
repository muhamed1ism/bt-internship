import { createReportApi } from '@app/api/report-api';
import routeNames from '@app/routes/route-names';
import { CreateReportFormValues } from '@app/schemas';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

export const useCreateReport = () => {
  const navigate = useNavigate();

  const { mutate, isPending, error } = useMutation({
    mutationFn: ({ formData, userId }: { formData: CreateReportFormValues; userId: string }) =>
      createReportApi(formData, userId),
    onSuccess: () => {
      navigate(routeNames.buckets());
    },
  });

  return { mutate, isPending, error };
};
