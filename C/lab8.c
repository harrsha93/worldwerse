#include<stdio.h>
void main()
{
    int i,j,n,temp,a[10],k;
    printf("\n Enter the number of elemets :");
    scanf("%d",&n);
    printf(" Enter the elements to sort :\n");
     for(i=0;i<n;i++)
      scanf("%d",&a[i]);
    printf("\n given array :");
     for(i=0;i<n;i++)
     printf("%d\n",a[i]);

   for(j=1;j<n;j++)
   {
    for(i=0;i<n-j;i++)
    {
        if(a[i]>a[i+1])
        {
            temp=a[i];
            a[i]=a[i+1];
            a[i+1]=temp;

        }
    }
   }
  printf("\n sorted array :");
  for(i=0;i<n;i++)
   printf("%d\n",a[i]);
}