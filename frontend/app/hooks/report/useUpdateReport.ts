import { updateReportApi } from '@app/api/report-api';
import routeNames from '@app/routes/route-names';
import { UpdateReportFormValues } from '@app/schemas';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

export const useUpdateReport = () => {
  const navigate = useNavigate();

  const { mutate, isPending, error } = useMutation({
    mutationFn: ({ formData, reportId }: { formData: UpdateReportFormValues; reportId: string }) =>
      updateReportApi(formData, reportId),
    onSuccess: () => {
      navigate(routeNames.buckets());
    },
  });

  return { mutate, isPending, error };
};
