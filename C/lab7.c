#include<stdio.h>
#include<math.h>
void main()
{
    int i, degree;
    float x,sum=0,term,numa,deno;
    printf("\n Enter the value of a degree:");
    scanf("%d",&degree);
    x=degree*(3.1416/180);
    term=x;
    sum=term;
 for(i=3;i<=degree;i+=2)
   {
    numa=-term*x*x;
    deno=(i-1)*i; 
    term=(numa/deno);
    sum=sum+term;
   }
   printf(" the sine of %d is %.3f\n",degree,sum);
   printf(" the sine of %d using library function is %.3f\n",degree,sin(x));
}
