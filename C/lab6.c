#include<stdio.h>
void main()
{
 int a[3][3],b[3][3],c[3][3];
 int r1,c1,r2,c2,i,j,k;

 printf("\n Enter the order of matrix 1:");
 scanf("%d %d",&r1,&c1);
 printf("\n Enter the order of matrix 2:");
 scanf("%d %d",&r2,&c2);

 if(c1==r2)
 {
    printf("\n Enter the elements of matrix 1:");
    for(i=0;i<r1;i++)
     {
        for(j=0;j<c1;j++)
        {
            scanf("%d",&a[i][j]);
        }
     }
    printf("\n Enter the elements of matrix 2:");
    for(i=0;i<r2;i++)
    {
     for(j=0;j<c2;j++)
     {
    scanf("%d",&b[i][j]);
     }
    }
 for(i=0;i<r1;i++)
   {
    for(j=0;j<c2;j++)
   {
    c[i][j]=0;
    for(k=0;k<c1;k++)
    {
    c[i][j]+=a[i][k]*b[k][j];
    }
   }
   }
   printf("\n The resultant matrix is :\n");
   {
    for(i=0;i<r1;i++)
    {
    for(j=0;j<c2;j++)
    {
    printf("%d\t",c[i][j]);
    }
    printf("\n");
   }
   }
 }
 else
printf(" Matrix multiplication is not possible");
   }
 

