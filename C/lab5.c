#include<stdio.h>
void main()
{
    int i,item,low,high,mid,a[50],n;
    printf("\n Enter size of an array:");
    scanf("%d",&n);
    printf("\n Enter elements of an array in sorted form:");
     for(i=0;i<n;i++)
     scanf("%d",&a[i]);
    printf("\n Enter the item to be searched:");
    scanf("%d",&item);
    low=0;
    high=n-1;
    mid=(low+high)/2;
    while((low<=high)&&(a[mid]!=item))
    {
        if(item<a[mid])
        high=mid-1;
        else
        low=mid+1;
        mid=(low+high)/2;
    }
    if(a[mid]==item)
    printf("\n\n %d found at location %d",item,mid+1);
    else
    printf("\n\n %d doesn't exist",item);         

}

