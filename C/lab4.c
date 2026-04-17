#include<stdio.h>
void main()
{
    int n=5;

    for(int line=1;line<=n;line++)
     {
        for(int space=n-line;space>=1;space--)
        {
            printf(" ");
        }
    for(int i=1;i<=line;i++)
      {
        printf("%d",i);
      }
    for(int j=line-1;j>=1;j--)
      {
        printf("%d",j);
      }
       printf("\n");
     }
}