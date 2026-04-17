include<stdio.h>
#include<stdlib.h>
void main()
{
    int ch,a,b;
    float res;
    printf(" enter two numbers :\n");
    scanf("%d %d",&a,&b);
    printf(" 1=add,2=sub,3=mul,4=div,5=rem\n");
    printf(" enter your choice :\n");
    scanf(" %d",&ch);
    switch(ch)
    {
        case 1:res=a+b;
              printf("result=%f\n",res);
              break ;

       case 2:res=a-b;
              printf("result=%f\n",res);
              break ;

        case 3:res=a*b;
              printf("result=%f\n",res);
              break ;

        case 4:res=(float)(a/b);
              printf("result=%f\n",res);
              break ;

        case 5:res=a%b;
              printf("result=%f\n",res);
              break ;

      default :
            printf(" entered wrong choice \n");
    }
}

