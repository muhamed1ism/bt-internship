import { createReportApi } from '@app/api/report-api';
import routeNames from '@app/routes/route-names';
import { CreateReportFormValues } from '@app/schemas';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

export const useCreateReport = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: ({ formData, userId }: { formData: CreateReportFormValues; userId: string }) =>
      createReportApi(formData, userId),
    onSuccess: (_, { userId }) => {
      // Invalidate the specific user's reports cache
      queryClient.invalidateQueries({ queryKey: ['reports-by-user-id', userId] });
      // Also invalidate other report-related queries
      queryClient.invalidateQueries({ queryKey: ['user-reports'] });
      queryClient.invalidateQueries({ queryKey: ['author-reports'] });
    },
  });

  return { mutate, isPending, error };
};
