class person {
    String first;
    String last;

    person(String first, String last) {
        this.first = first;
        this.last = last;
    }

    void display() {
        System.out.println("First Name: " + first + " Last Name: " + last);
    }
}

class employee extends person {
    int Eid;
    double salary;

    public employee(String first, String last, int Eid, double salary) {
        super(first, last);
        this.Eid = Eid;
        this.salary = salary;
    }

    void showemp() {
        System.out.println("First Name: " + first + " Last Name: " + last);
        System.out.println("Employee ID: " + Eid + " Salary: " + salary);
    }
}

class student extends person {
    int roll;
    float score;

    public student(String first, String last, int roll, float score) {
        super(first, last);
        this.roll = roll;
        this.score = score;
    }

    void showstud() {
        System.out.println("First Name: " + first + " Last Name: " + last);
        System.out.println("Roll No: " + roll + " Score: " + score);
    }
}

public class SuperKeyword {
    public static void main(String[] args) {
        person p = new person("Vani", "Anil");
        p.display();
        employee e = new employee("deepa", "meda", 111, 200000);
        e.showemp();
        student s = new student("John", "Doe", 123, 90.5f);
        s.showstud();
    }
}
